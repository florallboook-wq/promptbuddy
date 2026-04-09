/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PromptTone = 'Professional' | 'Casual' | 'Friendly' | 'Formal' | 'Persuasive' | 'Creative';
export type PromptFormat = 'Paragraph' | 'Bullet Points' | 'Table' | 'Email' | 'Message' | 'Essay' | 'Step-by-step';
export type PromptTemplate = 
  | 'Text / Writing' 
  | 'Photo Editing' 
  | 'Image Generation' 
  | 'Code / Dev' 
  | 'Research & Analysis' 
  | 'Summarization' 
  | 'Brainstorming' 
  | 'Translation';

interface PromptOptions {
  task: string;
  context: string;
  tone: PromptTone;
  format: PromptFormat;
  enhance: boolean;
  template: PromptTemplate;
}

export function buildPrompt({ task, context, tone, format, enhance, template }: PromptOptions): string {
  if (!task.trim()) return "";

  const toneGuide: Record<string, string> = {
    Professional: "professional and polished — prioritize clarity, credibility, and precision",
    Casual: "casual and conversational — relaxed, like explaining to a knowledgeable friend",
    Friendly: "warm and approachable — encouraging, inclusive, and easy to connect with",
    Formal: "strictly formal — no contractions, no colloquialisms, precise language throughout",
    Persuasive: "persuasive and confident — use compelling arguments, strong evidence, and a decisive voice",
    Creative: "creative and expressive — imaginative, vivid, willing to break conventions where it adds impact",
  };

  const formatGuide: Record<string, string> = {
    Paragraph: "well-connected prose paragraphs with smooth transitions. Do not use bullet points or numbered lists.",
    "Bullet Points": "concise bullet points. Each point must be self-contained and scannable.",
    Table: "a well-organized table with clear column headers and aligned rows.",
    Email: "a complete email — subject line, professional greeting, body paragraphs, and a closing sign-off.",
    Message: "a brief message of 3–5 sentences — suitable for WhatsApp, Slack, or SMS.",
    Essay: "a structured essay — introduction, body paragraphs with supporting arguments, and a strong conclusion.",
    "Step-by-step": "clearly numbered steps. Each step must be actionable and follow logically from the previous.",
  };

  // Photo Editing
  if (template === "Photo Editing") {
    const parts = [];
    parts.push(`You are an expert photo editor and retoucher. Your task is to edit the following photo based on the brief below.`);
    parts.push(`Subject and task: ${task.trim()}.`);
    if (context.trim()) parts.push(`Style reference and mood: ${context.trim()}.`);
    
    parts.push(`Enhance the overall look of the photo in a ${tone.toLowerCase()} style — improve composition, exposure, color balance, and sharpness where needed while maintaining a natural, realistic result.`);
    
    if (enhance) parts.push(`Quality standards: Preserve fine details and avoid over-smoothing or HDR artifacts. Keep edits non-destructive where possible. If using AI tools such as Firefly, Midjourney, or Canva AI, specify the style prompt clearly. Deliver the final result in high resolution — minimum 300 DPI for print or 72 DPI for web.`);
    return parts.join(" ");
  }

  // Image Generation
  if (template === "Image Generation") {
    const parts = [];
    parts.push(`Generate a high-quality image based on the following description.`);
    parts.push(`Subject: ${task.trim()}.`);
    if (context.trim()) parts.push(`Scene and setting: ${context.trim()}.`);
    parts.push(`Visual style: ${tone}-inspired — ${toneGuide[tone]}.`);
    parts.push(`Mood and lighting: soft natural light with warm tones and photorealistic quality.`);
    parts.push(`Composition: rule of thirds, subject in focus, shallow depth of field with a clean background.`);
    parts.push(`Camera style: shot on Sony A7IV, 85mm f/1.4 lens, with beautiful background bokeh.`);
    if (enhance) parts.push(`Quality parameters: ultra-detailed, 8K resolution, sharp focus, award-winning photography style, hyperrealistic rendering. Midjourney parameters: --ar 16:9 --v 6 --style raw --q 2.`);
    return parts.join(" ");
  }

  // Code / Dev
  if (template === "Code / Dev") {
    const parts = [];
    parts.push(`You are a senior software engineer and technical expert.`);
    parts.push(`Task: ${task.trim()}.`);
    if (context.trim()) parts.push(`Context and constraints: ${context.trim()}.`);
    parts.push(`Tone: ${toneGuide[tone]}.`);
    parts.push(`Write clean, well-commented, production-ready code following best practices and appropriate design patterns for the language or framework involved.`);
    parts.push(`Present the output as ${formatGuide[format]}`);
    if (enhance) parts.push(`Handle edge cases, errors, and input validation throughout. After each major code block, provide a plain English explanation of what it does. Also suggest any optimizations or alternative approaches worth considering.`);
    return parts.join(" ");
  }

  // Research & Analysis
  if (template === "Research & Analysis") {
    const parts = [];
    parts.push(`You are an expert research analyst with deep domain knowledge.`);
    parts.push(`Research topic: ${task.trim()}.`);
    if (context.trim()) parts.push(`Scope and background: ${context.trim()}.`);
    parts.push(`Use a ${toneGuide[tone]} tone throughout.`);
    parts.push(`Present your findings as ${formatGuide[format]}`);
    parts.push(`Structure your analysis with the following sections: an executive summary of 3 to 4 sentences, key findings supported by specific data points, trends or patterns observed, and actionable implications or recommendations.`);
    if (enhance) parts.push(`End with a section on further questions or areas worth exploring based on the findings.`);
    return parts.join(" ");
  }

  // Brainstorming
  if (template === "Brainstorming") {
    const parts = [];
    parts.push(`You are a creative strategist and idea generation expert.`);
    parts.push(`Brainstorm topic: ${task.trim()}.`);
    if (context.trim()) parts.push(`Context and constraints: ${context.trim()}.`);
    parts.push(`Use a ${toneGuide[tone]} tone.`);
    parts.push(`Generate at least 10 diverse and original ideas — ranging from safe and practical to bold and unconventional. For each idea, give it a punchy name and a 1 to 2 sentence explanation.`);
    parts.push(`Present ideas as ${formatGuide[format]}`);
    if (enhance) parts.push(`Mark the top 3 ideas with a star and briefly explain why they stand out. For each of those top ideas, suggest one immediate next action to move it forward.`);
    return parts.join(" ");
  }

  // Summarization
  if (template === "Summarization") {
    const parts = [];
    parts.push(`You are an expert summarizer and editor.`);
    parts.push(`Summarize the following: ${task.trim()}.`);
    if (context.trim()) parts.push(`Additional context: ${context.trim()}.`);
    parts.push(`Use a ${toneGuide[tone]} tone.`);
    parts.push(`Present the summary as ${formatGuide[format]}`);
    parts.push(`Preserve all key facts, figures, and conclusions. Omit filler, repetition, and obvious statements. The summary must not exceed 20% of the original length.`);
    if (enhance) parts.push(`If the original source contains conflicting points or uncertainty, flag those clearly. End with one sentence stating the single most important takeaway.`);
    return parts.join(" ");
  }

  // Translation
  if (template === "Translation") {
    const parts = [];
    parts.push(`You are a professional multilingual translator.`);
    parts.push(`Translation task: ${task.trim()}.`);
    if (context.trim()) parts.push(`Context: ${context.trim()}.`);
    parts.push(`Maintain a ${toneGuide[tone]} tone in the translated output.`);
    parts.push(`Translate accurately while preserving the original meaning and intent. Do not translate word-for-word — adapt idioms and expressions so they sound natural in the target language.`);
    if (enhance) parts.push(`Note any culturally specific terms, phrases, or references that may need additional explanation for the target audience. If multiple valid translations exist for a key term, list the options and explain the difference.`);
    return parts.join(" ");
  }

  // Text / Writing (default)
  const parts = [];
  parts.push(`You are an expert writer and communicator.`);
  parts.push(`Task: ${task.trim()}.`);
  if (context.trim()) parts.push(`Context: ${context.trim()}.`);
  parts.push(`Use a ${toneGuide[tone]} tone throughout.`);
  parts.push(`Present your response as ${formatGuide[format]}`);
  if (enhance) parts.push(`Structure your response with a clear beginning, middle, and end. Be specific — avoid vague or generic statements. Use concrete examples, data, or evidence wherever relevant. If anything in the request is ambiguous, state your assumption clearly before proceeding.`);
  return parts.join(" ");
}

