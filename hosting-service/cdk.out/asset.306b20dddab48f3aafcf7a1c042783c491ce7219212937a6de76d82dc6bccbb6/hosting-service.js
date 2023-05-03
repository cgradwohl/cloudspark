#!/usr/bin/env node
"use strict";var D=Object.create;var P=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty;var T=(t,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of I(e))!R.call(t,c)&&c!==o&&P(t,c,{get:()=>e[c],enumerable:!(n=C(e,c))||n.enumerable});return t};var i=(t,e,o)=>(o=t!=null?D(N(t)):{},T(e||!t||!t.__esModule?P(o,"default",{value:t,enumerable:!0}):o,t));var E=require("source-map-support/register"),v=i(require("aws-cdk-lib"));var k=i(require("aws-cdk-lib")),s=require("aws-cdk-lib"),l=i(require("aws-cdk-lib/aws-iam")),a=i(require("aws-cdk-lib/aws-route53")),w=i(require("aws-cdk-lib/aws-route53-targets")),y=i(require("aws-cdk-lib/aws-certificatemanager")),r=i(require("aws-cdk-lib/aws-cloudfront")),A=i(require("aws-cdk-lib/aws-cloudfront-origins")),p=i(require("aws-cdk-lib/aws-s3")),f=i(require("aws-cdk-lib/aws-s3-deployment")),O=require("constructs"),h=class extends O.Construct{constructor(e,o,n){super(e,o);let c=a.HostedZone.fromLookup(this,"Zone",{domainName:n.domainName}),u=n.siteSubDomain+"."+n.domainName,b=new r.OriginAccessIdentity(this,"cloudfront-OAI",{comment:`OAI for ${o}`});new s.CfnOutput(this,"Site",{value:"https://"+u});let m=new p.Bucket(this,"SiteBucket",{bucketName:u,publicReadAccess:!1,blockPublicAccess:p.BlockPublicAccess.BLOCK_ALL,removalPolicy:s.RemovalPolicy.DESTROY,autoDeleteObjects:!0});m.addToResourcePolicy(new l.PolicyStatement({actions:["s3:GetObject"],resources:[m.arnForObjects("*")],principals:[new l.CanonicalUserPrincipal(b.cloudFrontOriginAccessIdentityS3CanonicalUserId)]})),new s.CfnOutput(this,"Bucket",{value:m.bucketName});let g=new y.DnsValidatedCertificate(this,"SiteCertificate",{domainName:u,hostedZone:c,region:"us-east-1"});new s.CfnOutput(this,"Certificate",{value:g.certificateArn});let S=new r.Distribution(this,"SiteDistribution",{certificate:g,defaultRootObject:"index.html",domainNames:[u],minimumProtocolVersion:r.SecurityPolicyProtocol.TLS_V1_2_2021,errorResponses:[{httpStatus:403,responseHttpStatus:403,responsePagePath:"/error.html",ttl:s.Duration.minutes(30)}],defaultBehavior:{origin:new A.S3Origin(m,{originAccessIdentity:b}),compress:!0,allowedMethods:r.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,viewerProtocolPolicy:r.ViewerProtocolPolicy.REDIRECT_TO_HTTPS}});new s.CfnOutput(this,"DistributionId",{value:S.distributionId}),new a.ARecord(this,"SiteAliasRecord",{recordName:u,target:a.RecordTarget.fromAlias(new w.CloudFrontTarget(S)),zone:c}),new f.BucketDeployment(this,"DeployWithInvalidation",{sources:[f.Source.asset("./dist")],destinationBucket:m,distribution:S,distributionPaths:["/*"]})}},d=class extends k.Stack{constructor(e,o,n){super(e,o,n),new h(this,"StaticSite",{domainName:this.node.tryGetContext("domain"),siteSubDomain:this.node.tryGetContext("subdomain"),env:{account:"686719342996",region:"us-east-1"}})}};var _=new v.App;new d(_,"HostingServiceStack",{env:{account:"686719342996",region:"us-east-1"}});