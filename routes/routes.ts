import { UrlObject } from "url";

interface NestedRoutes {
    nestedRoute?: RouteDetails;
    innerRoutes?: RouteDetails[];
    singleRoute?: RouteDetails;
}

interface RouteDetails {
    title: string;
    href: string | UrlObject;

}

const routes: NestedRoutes[] = [
    {
        nestedRoute: {
            title: "上衣",
            href: {
                pathname: "/products",
                query: { kind: "clothes" }
            }
        },
        innerRoutes: [
            {
                title: "襯衫",
                href: {
                    pathname: "/products",
                    query: { tag: "shirt" }
                }
            },
            {
                title: "T恤",
                href: {
                    pathname: "/products",
                    query: { tag: "t-shirt" }
                }
            }
        ]
    },
    {
        nestedRoute: {
            title: "褲子",
            href: {
                pathname: "/products",
                query: { kind: "pants" }
            }
        },
        innerRoutes: [
            {
                title: "牛仔褲",
                href: {
                    pathname: "/products",
                    query: { tag: "jeans" }
                }
            },
            {
                title: "短褲",
                href: {
                    pathname: "/products",
                    query: { tag: "shorts" }
                }
            }
        ]
    },
    {
        nestedRoute: {
            title: "外套",
            href: {
                pathname: "/products",
                query: { kind: "coats" }
            }
        },
        innerRoutes: [
            {
                title: "風衣",
                href: {
                    pathname: "/products",
                    query: { tag: "windcoat" }
                }
            },
            {
                title: "針織",
                href: {
                    pathname: "/products",
                    query: { tag: "knitting" }
                }
            }
        ]
    },
    {

        singleRoute: {
            title: "配件",
            href: {
                pathname: "/products",
                query: { tag: "accessories" }
            }
        }
    },
    {

        singleRoute: {
            title: "新品上市",
            href: {
                pathname: "/products",
                query: { tag: "new-arrival" }
            }
        }
    },
    {

        singleRoute: {
            title: "本月優惠",
            href: {
                pathname: "/products",
                query: { tag: "limit-time-offer" }
            }
        }
    },


]


export {routes}