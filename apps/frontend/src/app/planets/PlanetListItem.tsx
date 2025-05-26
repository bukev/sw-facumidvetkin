'use client';
import type { ListResponse } from "@bukev/types";
import Card from "src/components/Card";

type Props = {
    item: ListResponse['data'][number];
}

const PlanetListItem: React.FC<Props> = ({ item }) => {
    return (
        <Card
            id={item.id}
            title={item.name}
            type='planets'
        />
    )
}

export default PlanetListItem;