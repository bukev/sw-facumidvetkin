import type { ListResponse } from "@types";

type Props = {
    item: ListResponse['data'][number];
}

const MovieListItem: React.FC<Props> = ({ item }) => {
    return (
        <div
            className="box-item"
            key={item.id}
        >
            <p style={{fontWeight: 800}}>Episode {item.episode}: {item.title}</p>
            <p>{item.director}</p>
            <p>{item.releaseDate}</p>
        </div>
    )
}

export default MovieListItem;