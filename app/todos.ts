export class ToDo {
    id: number;
    name: string
    dueDate: Date;
    archived: boolean;
    
    constructor(id: number, name: string, dueDate: Date) {
        this.id = id;
        this.name = name;
        this.dueDate = dueDate;
        this.archived = false;
    }
}