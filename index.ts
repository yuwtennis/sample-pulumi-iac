import {Env, SampleBlogDirector} from "./pkgs/director";
import * as pulumi from "@pulumi/pulumi";

async function main() {
    const builder = new SampleBlogDirector(
        pulumi.getOrganization(),
        pulumi.getProject())
    builder.create(Env[pulumi.getStack() as keyof typeof Env]);
}

(async () => {await main()})();
