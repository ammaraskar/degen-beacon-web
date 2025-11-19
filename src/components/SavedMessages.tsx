import { useEffect, useState } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function SavedMessages({ rpc }: { rpc: RpcInterface }) {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        rpc.getSavedMessages().then(response => {
            setMessages(response.Messages);
        });
    }, [rpc]);

    return (
        <>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Saved Messages
            </Typography>
            <Paper elevation={1}>
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="edit">
                                    <Edit />
                                </IconButton>
                            }>
                            <ListItemText primary={msg} />
                        </ListItem>
                    ))
                    }
                </List>
            </Paper>
        </>
    );
}