import { useEffect, useState } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

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
                    {messages.map((msg, index) => <MessageItem idx={index} message={msg} key={index} />)}
                </List>
            </Paper>
        </>
    );
}

function MessageItem({ idx, message }: { idx: number; message: string }) {
    const [editMode, setEditMode] = useState(false);

    return (
        <ListItem
            key={idx}
            secondaryAction={
                editMode ? 
                    null :
                    <IconButton edge="end" aria-label="edit" onClick={() => setEditMode(!editMode)}>
                        <Edit />
                    </IconButton>
            }>
            <ListItemText
                primary={editMode ?
                    <Stack direction="row" spacing={1}>
                        <TextField fullWidth size="small" value={message} />
                        <Button variant="outlined">Save</Button>
                        <Button variant="outlined" color="error" onClick={() => setEditMode(false)}>Cancel</Button>
                    </Stack> :
                    message} />
        </ListItem>
    );
}