import {Dev} from "./pkgs/stacks/dev";

function main() {
    const s = new Dev();

    s.compile();
}

// Export the name of the bucket
//export const bucketName = bucket.id;