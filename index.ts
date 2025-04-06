import {Env, Director} from "./pkgs/director";
import * as pulumi from "@pulumi/pulumi";
import {SpecSchema} from "./pkgs/config";

async function main() {
    const config = new pulumi.Config();
    const builder = new Director(
        pulumi.getOrganization(),
        pulumi.getProject(),
    );
    builder.create(
        Env[pulumi.getStack() as keyof typeof Env],
        config.requireObject<SpecSchema>("spec"));
}

(async () => {await main()})();
