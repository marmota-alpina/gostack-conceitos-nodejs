
module.exports = class Repository{
    constructor(id, title, url, techs, likes=0){
        this.id = id;
        this.title = title;
        this.url = url;
        this.techs = Object.assign([],techs);
        this.likes = likes;
    }

    addLike(){
        this.like++;
        return this;
    }
}