import { db } from '../config/config';
import { CrudService } from './CrudService';
import { UserComment } from '../models/Comment';

// TODO: implement service
export class CommentService implements CrudService<UserComment> {

    findById(id: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM  comments WHERE id=?";
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
    
    findAll(): Promise<UserComment[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM comments";

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

    async createOne(comment: UserComment): Promise<UserComment> {
        try {
            // copy user info
            const newComment = { ...comment };
                        // set new password and save the user
            //const salt = await bcrypt.genSalt(10);
            //const hash = await bcrypt.hash(newUser.password, salt);
            //newUser.password = hash; preguntar de como se valida el usuario que esta haciendo un nuevo post
            const insertQuery =
                "INSERT INTO " +
                "comments(user_id, post_id, content) " +
                "VALUES(?, ?, ?)";
            const insertValues = [
                newComment.userId,
                newComment.postId,
                newComment. content
            ];
            const insert = await db.query(insertQuery, insertValues);
            const insertedPost = await this.findById(insert.insertId);
            return insertedPost;
        } catch (err) {
            console.log(err.message);
        }
    }

    updateOne(id: string, updateComment: UserComment): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            
            const sel = `
            UPDATE posts
            SET user_id=COALESCE(?,user_id), 
            post_id=COALESCE(?,post_id), 
            content=COALESCE(?,content) 
            WHERE id=?`;
            
            const values = [
                updateComment.userId, 
                updateComment.postId,
                updateComment.content,
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

    deleteOne(id: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const sel = 'DELETE FROM comments WHERE id=?'
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
