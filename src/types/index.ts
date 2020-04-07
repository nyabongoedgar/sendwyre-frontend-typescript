// export interface StoreState {
//     languageName: string;
//     enthusiasmLevel: number;
// }

export interface StoreState {
    account: {
        userId: string;
        account: any;
    };
}