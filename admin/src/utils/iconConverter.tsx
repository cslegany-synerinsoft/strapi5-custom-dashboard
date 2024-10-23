import { TItemIcon, TCategoryIcon } from "../../../typings";
import {
    Database, Cog,
    Discuss, Information, Key, List, Mail, Message, Paragraph,
    PriceTag, User, Folder, Microphone, ListPlus, Lightning, PuzzlePiece,
    File, Image, PinMap, ChartBubble, ChartCircle, ChartPie,
} from '@strapi/icons';

const convertIcon = (icon: TItemIcon | TCategoryIcon) => {
    switch (icon) {
        case "Database":
            return <Database />
        case "Cog":
            return <Cog />;
        case "Discuss":
            return <Discuss />;
        case "Information":
            return <Information />;
        case "Key":
            return <Key />;
        case "List":
            return <List />;
        case "Mail":
            return <Mail />;
        case "Message":
            return <Message />;
        case "Paragraph":
            return <Paragraph />;
        case "PriceTag":
            return <PriceTag />;
        case "User":
            return <User />;
        case "Folder":
            return <Folder />;
        case "Microphone":
            return <Microphone />;
        case "ListPlus":
            return <ListPlus />;
        case "Lightning":
            return <Lightning />;
        case "PuzzlePiece":
            return <PuzzlePiece />;
        case "File":
            return <File />;
        case "Image":
            return <Image />;
        case "PinMap":
            return <PinMap />;
        case "ChartBubble":
            return <ChartBubble />;
        case "ChartCircle":
            return <ChartCircle />;
        case "ChartPie":
            return <ChartPie />;
        default:
            break;
    }
    return null;
}

export default convertIcon;