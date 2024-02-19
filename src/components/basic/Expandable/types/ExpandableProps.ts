import Layer from "../../../../style/Layer"

export interface ExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    title: string,
    editing?: boolean
}