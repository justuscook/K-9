export default interface IBuild {
    name: string | string [];
    instance: string;
    allImages: string;
    gearImage?: string;
    masteryImage?: string;
    statsImage?: string;
    note?: string;
    authorID: number;
    guid: number;
}