import { Grid } from "@mui/material";
import { ReactNode } from "react";

export default function GridContent({ xs, sm, md, lg, xl, columns,title,content,alignItems }: GridContentProps) {

    const cxs= columns && xs? columns - xs:undefined;
    const csm =  columns && sm? columns - sm:undefined;
    const cmd= columns && md? columns - md:undefined;
    const clg= columns && lg? columns - lg:undefined;
    const cxl = columns && xl? columns - xl:undefined;

    return (
        <Grid container columns={columns} alignItems={alignItems}>
            <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
                {title}
            </Grid>
            <Grid item xs={cxs} sm={csm} md={cmd} lg={clg} xl={cxl}>
                {content}
            </Grid>
        </Grid>
    )
}


interface GridContentProps {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    columns?: number;
    title:ReactNode;
    content:ReactNode;
    alignItems?:string;
}