import React, { useEffect } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import type { SavedLocation } from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.Lat},${location.Lng}`;

    return (
        <Card
            key={idx}
            elevation={2}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <LocationOnIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
                                {location.Name}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={`Lat: ${location.Lat.toFixed(6)}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontFamily: 'monospace' }}
                                />
                                <Chip
                                    label={`Lng: ${location.Lng.toFixed(6)}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontFamily: 'monospace' }}
                                />
                            </Stack>
                        </Box>
                    </Box>

                    <IconButton
                        color="primary"
                        aria-label="view on google maps"
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </Stack>
            </CardContent>
        </Card>
    );
}