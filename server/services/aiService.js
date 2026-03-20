const OpenAI = require('openai');
require('dotenv').config();

// Standard Initialize
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'missing-key-prevent-crash',
});

exports.askChatbot = async (context, userPrompt) => {
  if (!process.env.OPENAI_API_KEY) {
    return `Hello! I noticed you asked: "${userPrompt}". Based on your current live tracking data, you have **${context.totalOrders}** total orders, accumulating a total revenue of **$${context.totalRevenue.toFixed(2)}**. There are currently **${context.pendingOrders}** orders pending fulfillment. Let me know if you want me to generate any specific charts!`;
  }

  const systemMessage = `
You are a highly capable AI assistant embedded inside a "Customer Order Management & Analytics Dashboard".
You have access to the following current real-time database statistics that you must use to answer the user's question accurately:
${JSON.stringify(context, null, 2)}

Provide clear, concise, and helpful answers. If the user asks for a specific metric (like revenue or pending orders), look at the context provided and give the exact number. Format numbers attractively.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
};

exports.generateChartConfig = async (userPrompt) => {
  if (!process.env.OPENAI_API_KEY) {
    const isPie = userPrompt.toLowerCase().includes('pie');
    const isLine = userPrompt.toLowerCase().includes('line');
    return {
      type: isPie ? "pie" : (isLine ? "line" : "bar"),
      title: `Mock Auto-Chart (${isPie ? "Pie" : (isLine ? "Line" : "Bar")})`,
      width: 2,
      height: 2,
      config: {
        xAxis: "product",
        yAxis: "totalAmount",
        aggregation: "Sum",
        pieDataField: "product"
      }
    };
  }

  const systemMessage = `
You are an AI that translates natural language requests for data visualization into precise JSON configuration objects for our Dashboard Widget system.
The user will ask for a chart (e.g., "show me sales by product in a pie chart").
You must infer the best 'type' if they don't specify, or use what they request.
Allowed types: 'bar', 'line', 'area', 'scatter', 'pie'

Return ONLY valid JSON matching this schema:
{
  "type": "string (bar, line, area, scatter, pie)",
  "title": "A short descriptive title for the chart widget",
  "width": "number between 1 and 4, typically 2 or 3",
  "height": "number between 1 and 4, typically 2",
  "config": {
    "xAxis": "The data field to group by on the X axis (e.g., 'product', 'status', 'country', 'createdAt')",
    "yAxis": "The data field to aggregate on the Y axis (e.g., 'totalAmount', 'quantity' - omit if pie chart)",
    "aggregation": "The mathematical operation (e.g., 'Sum', 'Count', 'Average')",
    "pieDataField": "If type is pie, the field to group by (e.g., 'status', 'product')"
  }
}
Do NOT wrap the output in markdown code blocks like \`\`\`json. Return RAW JSON.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.1,
  });

  try {
    const rawContent = response.choices[0].message.content.trim().replace(/^```json\s*/, '').replace(/```$/, '');
    return JSON.parse(rawContent);
  } catch (err) {
    throw new Error('AI failed to generate a valid chart configuration.');
  }
};

exports.generateInsights = async (context) => {
  if (!process.env.OPENAI_API_KEY) {
    return `💡 **Executive Insight**: Your total revenue stands firm at $${context.totalRevenue.toFixed(2)} across ${context.totalOrders} lifetime orders. You have a backlog of ${context.pendingOrders} orders waiting to be processed.`;
  }

  const systemMessage = `
You are a top-tier business analyst AI.
Review the following aggregated order data and generate 2 to 3 short, punchy bullet points of insight.
Focus on anomalies, top-performing products, or general status breakdown.
Use emojis sparingly but effectively.
Do not hallucinate data; use only the context provided.
Data:
${JSON.stringify(context, null, 2)}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: systemMessage }],
    temperature: 0.4,
  });

  return response.choices[0].message.content;
};
