import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

type Props = {
    ownerList: Owner[];
};

const Person: NextPage<Props> = ({ ownerList }) => {
    const router = useRouter();
    const { person, vehicle } = router.query;
    const [owners, setOwners] = React.useState<Owner[]>(ownerList);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        async function loadData() {
            setLoading(true);
            const response = await fetch(
                `http://localhost:4001/vehicles?ownerName=${person}&vehicle=${vehicle}`
            );
            const data = await response.json();
            setOwners(data);
            setLoading(false);
        }

        if (ownerList.length === 0) {
            loadData();
        }
    }, [person, vehicle, ownerList]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <pre>{JSON.stringify(owners, null, 4)}</pre>;
};

export default Person;

Person.getInitialProps = async (ctx) => {
    if (!ctx.req) {
        return { ownerList: [] };
    }

    const { person, vehicle } = ctx.query;
    const response = await fetch(
        `http://localhost:4001/vehicles?ownerName=${person}&vehicle=${vehicle}`
    );
    const data = await response.json();
    return {
        ownerList: data,
    };
};
