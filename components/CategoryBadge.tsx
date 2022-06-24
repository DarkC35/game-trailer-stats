import Link from "next/link";
import { mapCategoryToColor } from "../lib/utils"

interface Props {
    color: ReturnType<typeof mapCategoryToColor>
    href: string
    children: React.ReactNode
}

const CategoryBadge = ({ color, href, children }: Props) => {
    let className;
    if (color === 'blue')
        className = 'whitespace-nowrap hover:bg-blue-200 dark:hover:bg-blue-300 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900'
    else if (color === 'green')
        className = 'whitespace-nowrap hover:bg-green-200 dark:hover:bg-green-300 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900'
    else if (color === 'red')
        className = 'whitespace-nowrap hover:bg-red-200 dark:hover:bg-red-300 bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900'
    else
        className = 'whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-300 bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-200 dark:text-gray-900'
    return (
        <Link href={href}>
            <a className={className}>
                {children}
            </a>
        </Link>
    )
}

export default CategoryBadge