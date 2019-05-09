import { UserComment } from './Comment';
import { User } from './User';

export interface Post {
    id?: string;
    owner?: number;
    content?: string;
    post_timestamp?: Date;
    picture?: string;
    
}
