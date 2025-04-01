import {Stack} from "./stack";
import * as aws from "@pulumi/aws";

export class Dev implements Stack {
    constructor() {
    }

    compile() {
        // Create an AWS resource (S3 Bucket)
        const bucket = new aws.s3.BucketV2("my-bucket");
    }
}