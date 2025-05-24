import useFetchData from "../hooks/useFetchData";
import { ListResponse } from "@types";

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
    } = useFetchData(entity);

    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <>
            <div className="page-title-wrapper">
                <h1>{entity}</h1>
                <input
                    type="search"
                    name="Search"
                    placeholder={`Search ${entity}...`}
                    value={search as any}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="box-list-grid">
                {loading && (
                    <p>Loading {entity}...</p>
                )}

                {!loading && data?.map((item) => (
                    <ListItemComponent item={item} key={item.id} />
                ))}
            </div>
        </>
    );
}

export default Section;