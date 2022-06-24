export function mapCategoryToColor(categoryName: string) {
    if (categoryName.includes('PS') || categoryName.includes('PlayStation'))
        return 'blue'
    else if (categoryName.includes('Xbox'))
        return 'green'
    else if (categoryName.includes('Nintendo'))
        return 'red'
    else
        return 'gray'
}