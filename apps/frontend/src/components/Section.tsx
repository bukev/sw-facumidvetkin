import useFetchList from "src/hooks/useFetchList";
import { ListResponse } from "@bukev/types";
import { Animator, Text } from "@arwes/react";
import Loading from "./Loading";

type Props = {
    entity: 'characters' | 'movies' | 'starships' | 'planets';
    ListItemComponent: React.FC<{ item: ListResponse['data'][number] }>
}

const Section: React.FC<Props> = ({ entity, ListItemComponent }) => {
    const {
        data,
        loading,
        error,
        search,
        setSearch
    } = useFetchList(entity);

    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <Animator duration={{ enter: 1.5 }}>
            <div className="page-title-wrapper">
                <Text
                    as="h1"
                    manager="decipher"
                    fixed
                >
                    {entity}
                </Text>

                {!loading && (
                    <input
                        type="search"
                        name="Search"
                        placeholder={`Search ${entity}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                )}
            </div>

            {loading && <Loading />}

            {!loading && (
                <div className="box-list-grid">
                    {data.map((item) => (
                        <ListItemComponent item={item} key={item.id} />
                    ))}
                </div>
            )}
        </Animator>
    );
}

export default Section;