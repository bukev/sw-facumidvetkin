'use client';
import type { ListResponse } from "@bukev/types";
import Card from "src/components/Card";

type Props = {
    item: ListResponse['data'][number];
}

const StarshipListItem: React.FC<Props> = ({ item }) => {
    return (
        <Card
            id={item.id}
            title={item.name}
            subtitle={item.manufacturer}
            type='starships'
        />
    )
}

export default StarshipListItem;