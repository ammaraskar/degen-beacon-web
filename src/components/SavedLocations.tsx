import React, { useEffect } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import type { SavedLocation } from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

export function SavedLocations({ rpc }: { rpc: RpcInterface }) {
    const [locations, setLocations] = React.useState<SavedLocation[]>([]);

    useEffect(() => {
        rpc.getSavedLocations().then(response => {
            setLocations(response.Locations);
        });
    }, [rpc]);

    return (
        <>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Saved Locations
            </Typography>

            <Stack direction="column" spacing={2}>
                {locations.map((loc, index) => <LocationCard idx={index} location={loc} key={index} />)}
            </Stack>
        </>
    );
}

function LocationCard({ location, idx }: { location: SavedLocation, idx: number }) {
    return <Card key={idx}>
        <Typography sx={{ p: 2 }} variant="body1">
            {location.Name}: ({location.Lat}, {location.Lng})
        </Typography>
    </Card>;
}