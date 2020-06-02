import { DataUtilService } from "../services/data-util.service";

export class Payload {
    query: string;
    params: any[];

    constructor(
        query: string,
        params: any[],
    ) {
        this.query = query;
        this.params = params;
    }

    buildPayload(): string {
        let dataUtilService = new DataUtilService;
        return dataUtilService.replaceParams(this.query, this.params);
    }
}
