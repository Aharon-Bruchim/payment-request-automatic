/* v8 ignore start */
export interface Feature {
    name: string;
    age?: number;
}

export interface FeatureDocument extends Feature {
    _id: string;
}
