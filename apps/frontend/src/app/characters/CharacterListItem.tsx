import type { ListResponse } from "@types";

type Props = {
    item: ListResponse['data'][number];
}

const CharacterListItem: React.FC<Props> = ({ item }) => {
    return (
        <div
            className="box-item"
            key={item.id}
        >
            <p style={{fontWeight: 800}}>{item.name}</p>
            <p>{item.homeworld}</p>
        </div>
    )
}

export default CharacterListItem;