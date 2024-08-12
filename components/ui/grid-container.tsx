import { Grid } from "@mui/material"
import { ReactNode } from "react";

const GridContainer = ({ title, content, columns, xs, sm, md, lg, xl }: GridContainerProps) => {


    const cxs: number | undefined = xs ? columns - xs : undefined;
    const csm: number | undefined = sm ? columns - sm : undefined;
    const cmd: number | undefined = md ? columns - md : undefined;
    const clg: number | undefined = lg ? columns - lg : undefined;
    const cxl: number | undefined = xl ? columns - xl : undefined;

    return (
        <Grid container columns={columns}>
            <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
                {title}
            </Grid>
            <Grid item xs={cxs} sm={csm} md={cmd} lg={clg} xl={cxl}>
                {content}
            </Grid>
        </Grid>
    )
}


interface GridContainerProps {
    title: ReactNode;
    content: ReactNode;
    alignItems?:string;
    columns: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

export { GridContainer }