export const PayloadsConstant = {
  upsertDevice: '<SaveDeviceDetails><DeviceDetails><DeviceRegistry><DeviceName>{0}</DeviceName><MACAddress>{1}</MACAddress><DeviceProtocol>{2}</DeviceProtocol><HomeURL>{3}</HomeURL><DefaultHomeURL>{4}</DefaultHomeURL><Type>{5}</Type><Location>{6}</Location></DeviceRegistry></DeviceDetails></SaveDeviceDetails>',
  findDevicesByDeviceId: '<Query><Find><Device><DeviceId eq="{0}" /></Device></Find></Query>',
  findDevicesByMAC: '<Query><Find><Device><MACAddress>{0}</MACAddress></Device></Find></Query>',
  findDevicesByAttrName: '<Query><Find><Device><{1}>{0}</{1}></Device></Find></Query>',
  findDevicesByCertificateId: '<Query><Find><Device><certId>{0}</certId></Device></Find></Query>',
  findAllDevices: '<Query><Find><Device><DeviceId ne="" /></Device></Find></Query>',
  deleteDeviceByDeviceId: '<Query><DeleteDeviceDetails><Device><DeviceId>{0}</DeviceId></Device></DeleteDeviceDetails></Query>',
  deactivateDeviceByDeviceId: '<DeActivateDevice><DeviceId>{0}</DeviceId></DeActivateDevice>',
  createCertificateByCommonName: '<Query><GenerateDeviceSSLCerti><DeviceCertificate><commonName>{0}</commonName></DeviceCertificate></GenerateDeviceSSLCerti></Query>',
  deleteCertificateByCertificateId: '<Query><DeleteDeviceSSLCerti><certId>{0}</certId></DeleteDeviceSSLCerti></Query>',
  uploadCertificate: '<UploadCertificate><CertificateURL>{0}</CertificateURL></UploadCertificate>',
  findCertificateByCertificateId: '<Query><Find><DeviceCertificate><certId>{0}</certId></DeviceCertificate></Find></Query>',
  attachCertificateToDevice: '<Query><SaveDeviceDetails><DeviceDetails><DeviceRegistry><MACAddress>{0}</MACAddress><certId>{1}</certId></DeviceRegistry></DeviceDetails></SaveDeviceDetails></Query>',
  findUnattachedCertificates: '<Query><Find><DeviceCertificate><DeviceId eq="$NULL()" /></DeviceCertificate></Find></Query>',
  findAllCertificates: '<Query><Find><DeviceCertificate><certId ne="" /></DeviceCertificate></Find></Query>',
  findAllCertificatesByDeviceId: '<Query><Find><DeviceCertificate><certId ne="" /><DeviceId>{0}</DeviceId></DeviceCertificate></Find></Query>',
  unattachCertificateFromDevice: '<Query><DetachCertificate><DeviceId>{0}</DeviceId></DetachCertificate></Query>',
  //login: '<Login><UserName>{0}</UserName><password>{1}</password></Login>',
  login: '<Query><Login><UserName>{0}</UserName><Password>{1}</Password></Login></Query>',
  resetLoginInfor: '<LoadDefaultUser><ByForce>true</ByForce></LoadDefaultUser>',
  //logout: '<Logout><SessionToken>{0}</SessionToken></Logout>',
  logout: '<Query><Logout><SessionKey>{0}</SessionKey></Logout></Query>',
  updateLoginInfor: '<UpdateUser><UserName>{0}</UserName><Password>{1}</Password></UpdateUser>',
  deployAppOnDeviceFromHS: '<Query><DeployAppOnDeviceFromHS><DeviceId>{0}</DeviceId><AppId>{1}</AppId></DeployAppOnDeviceFromHS></Query>',
  unDeployAppOnDeviceFromHS: '<Query><UnDeployAppOnDeviceFromHS><DeviceId>{0}</DeviceId><AppId>{1}</AppId></UnDeployAppOnDeviceFromHS></Query>',
  hardResetDevice: '<HardResetDevice><DeviceId>{0}</DeviceId></HardResetDevice>',
  softResetDevice: '<SoftResetDevice><DeviceId>{0}</DeviceId></SoftResetDevice>',
  deviceTest: '<Query><Find format="version,known"><DeviceTest><TestId ne="" /></DeviceTest></Find></Query>',
  edge: {
    upsert: '<Query><DeployEdge><EdgeInformation><EdgeName>{0}</EdgeName><DisplayName>{1}</DisplayName><Region>{2}</Region><Location>{3}</Location><AddrLine1>{4}</AddrLine1><AddrLine2>{5}</AddrLine2><Country>{6}</Country><Zip>{7}</Zip><Name>{8}</Name><Email>{9}</Email><Phone>{10}</Phone><PrivateAddress>{11}</PrivateAddress><PrivatePort>{12}</PrivatePort><PublicAddress>{13}</PublicAddress><PublicPort>{14}</PublicPort><CommProtocol>{15}</CommProtocol><UserName>{16}</UserName><Password>{17}</Password><TargetSchemaAppPackage>{18}</TargetSchemaAppPackage><TargetSchemaAppName>{19}</TargetSchemaAppName></EdgeInformation></DeployEdge></Query>',
    getAll: '<Query><GetAllEdges></GetAllEdges></Query>',
    getById: '<Query><GetEdgesByName><EdgeId>{0}</EdgeId><EdgeName ne=""></EdgeName></GetEdgesByName></Query>',
    deployApp: '<DeployApp><EdgeId>{0}</EdgeId><AppId>{1}</AppId></DeployApp>',
    unDeployApplicationFromEdge: '<UnDeployApplicationFromEdge><EdgeId>{0}</EdgeId><AppId>{1}</AppId></UnDeployApplicationFromEdge>',
    deactivateEdge: '<DeactivateEdge><EdgeInformation><EdgeName>{0}</EdgeName><PublicAddress>{1}</PublicAddress><PublicPort>{2}</PublicPort></EdgeInformation></DeactivateEdge>',
    activateEdge: '<ActivateEdge><EdgeInformation><EdgeName>{0}</EdgeName><PublicAddress>{1}</PublicAddress><PublicPort>{2}</PublicPort></EdgeInformation></ActivateEdge>',
    deleteEdge: '<Query><DeleteEdge><EdgeId>{0}</EdgeId></DeleteEdge></Query>',
    query: {
      findAllVendor:'<Find><VendorInfo><vendorId ne=""></vendorId></VendorInfo></Find>'
    }
  },
  application: {
    upsert: '<RegisterApplication><Application><Name>{0}</Name><Version>{1}</Version><AppDownloadURL>{2}</AppDownloadURL></Application></RegisterApplication>',
    update: `<Query><Save><Application><AppId>{0}</AppId><AppDownloadURL Value="{1}" Known="{1}" Version="1"/><Name Value="{2}" Known="{2}" Version="1"/><Version Value="{3}" Known="{3}" Version="1"/></Application></Save></Query>`,
    remove: `<Query><DeleteAll><Application><AppId>{0}</AppId></Application></DeleteAll></Query>`,
    start: '',
    stop: '',
    restart: '',
    undeploy: '',
    redeploy: '',
    getAll: '<GetApplicationList/>',
    getById: '<Query><Find format="version,known"><Application><AppId>{0}</AppId></Application></Find></Query>',
    findAppsByAStackId: '<FindAppsByAStackId><AStackId>{0}</AStackId></FindAppsByAStackId>',
    findAStacksByApp: '<FindAStacksByApp><AppName>{0}</AppName><Version>{1}</Version></FindAStacksByApp>'
  },
  query: {
    container: '<Query><ExecuteEdgeQuery><EdgeName>{0}</EdgeName><QueryString>{1}</QueryString><AppLabel>{2}</AppLabel></ExecuteEdgeQuery></Query>',
    findAllQueryBuilder: '<Query><getqueries/></Query>',
    createQueryBuilder: '<Query><savequery><QueryBuilder><Name>{0}</Name><Location>{1}</Location><EdgeName>{2}</EdgeName><Label>{3}</Label><Opeation>{4}</Opeation></QueryBuilder></savequery></Query>' 
  },
  data: {
    fetchSyncInfo: '<FetchSyncInfo/>',
    fetchApplicableRule: '<FetchApplicableRule><SyncInfoId>{0}</SyncInfoId></FetchApplicableRule>',
    updateModelsStatus: '<UpdateModelStatus><SyncInfoId>{0}</SyncInfoId><Status>{1}</Status></UpdateModelStatus>',
    applyRuleToModel: '<ApplyRuleToModel><SyncInfoId>{0}</SyncInfoId><RuleId>{1}</RuleId>{2}</ApplyRuleToModel>',
    fetchRule: '<FetchRule/>',
    fetchRuleByTarget: '<FetchRule><{0}>{1}</{0}></FetchRule>',
    upsertRule: '<SaveRule>{0}<RuleName>{1}</RuleName><RuleType>{2}</RuleType><DestinationType>{3}</DestinationType><TargetConnectInfo><Url>{4}</Url><AccessKey>{5}</AccessKey><SecretKey>{6}</SecretKey><BucketId>{7}</BucketId><Username>{8}</Username><Password>{9}</Password><Brokers>{10}</Brokers></TargetConnectInfo><FrequencyInfo><OnChange>{11}</OnChange><Interval><Time>{12}</Time><Unit>{13}</Unit></Interval></FrequencyInfo><RetentionPolicyInfo><DeleteFor>{14}</DeleteFor><RetainFor>{15}</RetainFor><Interval><Time>{16}</Time><Unit>{17}</Unit></Interval></RetentionPolicyInfo></SaveRule>',
    deleteRules: '<DeleteRule><RuleId>{0}</RuleId></DeleteRule>'
  },
  websocket: {
    device: `<Query Storage='TqlSubscription'><Save><TqlSubscription Label='TempSensor' sid='20' Notify.As= ':$event:Model' Notify.Format='$sid'><Topic>**</Topic></TqlSubscription></Save></Query>`,
    edge: {
      query: `<Query Storage='TqlSubscription'><Save><TqlSubscription Lbel='TempSensor' sid='20' Notify.As= ':$event:Model' Notify.Format='$sid'><Topic>**</Topic></TqlSubscription></Save></Query>`
    }
  }
}