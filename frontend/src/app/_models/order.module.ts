export interface Order {
    id: number;
    user_id: number;
    status: string;
    
    fullname?:string;
    phone?:string;

}