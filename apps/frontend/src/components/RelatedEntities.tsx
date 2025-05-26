import Card from "./Card";

type Props = {
    type: 'characters' | 'planets' | 'movies' | 'starships';
    data: Record<string, string>[];
    title?: string;
}

const RelatedEntities: React.FC<Props> = ({ type, data, title }) => {
    return (
        <div className="detail-section">
            <h2>{title ?? type}</h2>

            <div className="box-list-grid">
                {data.map((item) => (
                    <Card
                        key={item.id}
                        id={item.id}
                        title={item.name}
                        type={type}
                    />
                ))}
            </div>

        </div>
    )
}

export default RelatedEntities;