import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { SYSTEM_PROMPT, type ModelConfig } from "../domain/types";
import { createModel } from "../infrastructure/model-factory";

export async function streamChat(messages: UIMessage[], config: ModelConfig) {
  const model = createModel(config);

  return streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });
}
