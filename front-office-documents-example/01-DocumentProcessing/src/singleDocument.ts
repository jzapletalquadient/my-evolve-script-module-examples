import { Messages } from "../../Utils/messages";
import { pathCombine } from "../../Utils/pathUtils";
import type { FrontOfficeMetadata } from "../node_modules/@quadient/evolve-front-office-scripting-utils/dist/index";

export function getBundledGenerateSteps(
  metadata: FrontOfficeMetadata,
  inputPath: string,
  outputDirectory: string,
  outputDirectoryForWatermark: string
): BundledGenerateOutputV2[] {
  const outputDirectoryPath = metadataIsCopy(metadata)
    ? outputDirectoryForWatermark
    : outputDirectory;
  const outputPath = pathCombine(outputDirectoryPath, "document.tno");
  console.debug(
    Messages.format(Messages.CreatingBundledGenerateSteps, outputPath)
  );

  return [
    {
      channel: "Print",
      outputType: "InspireNative",
      outputPath: outputPath,
      template: "${system.templatePath}",
      inputPaths: [
        {
          name: "${system.defaultDataInputName}",
          path: inputPath,
        },
      ],
      metadataPath: outputPath + ".json",
      correlationId: "${system.jobId}${system.correlationId}",
    },
  ];
}

function metadataIsCopy(metadata: FrontOfficeMetadata): boolean {
  if (!metadata.dispatchControl) {
    return false;
  }

  const isCopy = (
    metadata.dispatchControl as Record<string, Record<string, string>>
  )?.Clients?.IsCopy;
  return isCopy?.toLowerCase() === "true";
}
