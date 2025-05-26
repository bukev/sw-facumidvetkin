import { Text } from "@arwes/react";

type Props = {
    data: Record<string, string>
}

const Info: React.FC<Props> = ({ data }) => {
    const humanizeSnakeCase = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .trim();
    }

    return (
        <div className="detail-section">
            <div className="details-list-grid">
                {Object.keys(data).map((key) => (
                    <Text
                        manager='decipher'
                        fixed={true}
                        style={{ textTransform: 'capitalize' }}
                        key={key}
                    >
                        <b>
                            {humanizeSnakeCase(key)}:
                        </b>
                        {' '}
                        {data[key]}
                    </Text>
                ))}
            </div>
        </div>
    )
}

export default Info;