export class Edge {
  EdgeName: string;
  DisplayName: string;
  Region: string;
  Location: string;
  AddrLine1: string;
  AddrLine2: string;
  Country: string;
  Zip: string;
  Name: string;
  Email: string;
  Phone: string;
  PrivateAddress: string;
  PrivatePort: string;
  PublicAddress: string;
  PublicPort: string;
  CommProtocol: string;
  UserName: string;
  Password: string;

  constructor() { }

  format(raw): any {
    for (let key in raw) {
      this[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }
  }
}
