import { useRouter } from "next/router"

export default function ProductsPage(){

    const router =useRouter()

    console.log(router.query)
    return (
        <h1>
            ProductsPage: {router.query.tag}
        </h1>
    )
}