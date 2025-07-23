export class ToDo {
    id: number;
    name: string
    dueDate: Date;
    archived: boolean = false;
    tags: string[] = [];
    
    constructor(id: number, name: string, dueDate: Date) {
        this.id = id;
        this.name = name;
        this.dueDate = dueDate;
    }
}