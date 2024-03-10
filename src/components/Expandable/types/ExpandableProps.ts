import Layer from "../../../types/Layer"

export interface ExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    title: string,
    editing?: boolean
}