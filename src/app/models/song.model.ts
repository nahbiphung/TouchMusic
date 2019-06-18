interface Song {
    id: string;
    author: Array<any>;
    name: string;
    performerId: Array<any>;
    mp3Url: string;
    imageSong: string;
    video: string;
    imageVideo: string;
    songType: string;
    userId: string;
    albumId: string;
    country: string;
    lyric: string;
    view: number;
    like: number;
    comment: Array<Comment>;
}

interface Album {
    id: string;
    name: string;
    performerId: string;
    userId: string;
    image: string;
}

interface Country {
    id: string;
    image: string;
    name: string;
}

interface SongType {
    id: string;
    name: string;
}

interface Video {
    id: string;
    mp4Url: string;
    song: string;
}

interface Comment {
    commentId: number;
    content: string;
    like: number;
    postDate: Date;
    userAvatar: string;
    user: string;
    subComment: [SubComment];
}

interface SubComment {
    subCommentId: number;
    content: string;
    like: number;
    postDate: Date;
    user: string;
    userAvatar: string;
}

interface Performer {
    id: string;
    name: string;
    birthday: string;
    country: string;
    user: string;
    image: string;
}

