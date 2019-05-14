interface Song {
    id: string;
    author: string;
    name: string;
    performerId: string;
    mp3Url: string;
    video: string;
    songTypeId: string;
    userId: string;
    albumId: string;
    countryId: string;
    view: number;
    like: number;
    comment: [
        {
            commentId: number,
            content: string,
            like: number,
            postDate: Date,
            userId: string,
            subComment: [
                {
                    subCommentId: number;
                    content: string,
                    like: number,
                    postDate: Date,
                    userId: string,
                }
            ]
        }
    ];
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
    id: string;
    user: string;
    postDate: string;
    content: string;
    like: number;
}

interface Performer {
    id: string;
    name: string;
    birthday: string;
    country: string;
    user: string;
}

