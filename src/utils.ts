const getDocsFromSnapshot = (snapshot: any) => {
    let items: any[] = [];
    snapshot.forEach((item: any) => { items.push(item.data()) })
    return items;
}

export default {
    getDocsFromSnapshot
}