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
            {/* <Text as="h2">
                Details
            </Text> */}

            <div className="details-list-grid">
                {Object.keys(data).map((key) => (
                    <Text
                        manager='decipher'
                        fixed
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