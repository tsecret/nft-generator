const getDocsFromSnapshot = (snapshot: any) => {
    let items: any[] = [];
    snapshot.forEach((item: any) => { items.push(item.data()) })
    return items;
}

const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default {
    getDocsFromSnapshot,
    getBase64
}