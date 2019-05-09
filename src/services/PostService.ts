import { db } from '../config/config';
import { CrudService } from './CrudService';
import { Post } from '../models/Post';

// TODO: implement service
export class PostService implements CrudService<Post> {
    
    findById(id: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM  posts WHERE id=?";
            const values = [id];

            db.query(query, values)
            .then(rows => {
                if(rows && rows.length > 0){
                    delete rows[0].password;
                    resolve(rows[0])
                }else reject({error: "NOt found"})
            })
            .catch(err => {
                console.log(err.message);
            })
        })
    }    
    
    findAll(): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM posts";

            db.query(query)
                .then(rows => {
                    rows.map(e => {
                        delete e.password;
                        return e;
                    });
                    resolve(rows);
                })
                .catch(err => {
                    console.log(err.message);
                })
        })
    }

    async createOne(post: Post): Promise<Post> {
        try {
            // copy user info
            const newPost: Post = { ...post };
                        // set new password and save the user
            //const salt = await bcrypt.genSalt(10);
            //const hash = await bcrypt.hash(newUser.password, salt);
            //newUser.password = hash; preguntar de como se valida el usuario que esta haciendo un nuevo post
            const insertQuery =
                "INSERT INTO " +
                "posts(owner, content, post_timestamp, picture) " +
                "VALUES(?, ?, ?, ?)";
            const insertValues = [
                newPost.owner,
                newPost.content,
                newPost.post_timestamp,
               newPost.picture
            ];
            const insert = await db.query(insertQuery, insertValues);
            const insertedPost = await this.findById(insert.insertId);
            return insertedPost;
        } catch (err) {
            console.log(err.message);
        }
    }

    updateOne(id: string, updatePost: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
            
            const sel = `
            UPDATE posts
            SET owner=COALESCE(?,owner), 
            content=COALESCE(?,content), 
            ost_timestamp=COALESCE(?,post_timestamp),
            picture=COALESCE(?,picture) 
            WHERE id=?`;
            
            const values = [
                updatePost.owner, 
                updatePost.content, 
                updatePost.post_timestamp, 
                updatePost.picture, 
                id
            ];

            db.query(sel, values)
            .then(rows => {
                if (rows && rows.affectedRows > 0) {
                    const updatedUser = this.findById(id);
                    resolve(updatedUser) 
                } else reject({error: "Not found"})
            })
            .catch(err => {
                console.log(err.message);
                reject({error: "Error updating"})
            })        
        });
    }

    deleteOne(id: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            const sel = 'DELETE FROM posts WHERE id=?'
            const values = [id];

            db.query(sel, values)
                .then(rows => {

                    if (rows && rows.affectedRows > 0) {
                    resolve({id: id}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    console.log(err.message);
                    reject({error: "Not found"})
                })
        });
    }
}
