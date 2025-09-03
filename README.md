
npx create-react-app mcp-reactive-ui


https://dreampuf.github.io/GraphvizOnline

digraph SpringAI_MCP_Architecture {
    rankdir=TB;
    size="8,8";

    node [shape=rect style="rounded,filled"];

    users   [label="Business Users\n(Portal / App / API)" fillcolor=lightblue];
    client  [label="MCP Client (Spring AI)\n- Sends Requests\n- Calls MCP Server APIs" fillcolor=lightgreen];
    server  [label="MCP Server (Spring AI)\n- Orchestration & Prompt Mgmt\n- Business Logic\n- Provider Adapter Layer" fillcolor=lightyellow];
    llm     [label="LLM Providers\n(OpenAI GPT, Azure OpenAI, Anthropic, Local LLMs)" fillcolor=lightcoral];
    outputs [label="Business Solution Outputs\n(Insights, Reports, Actions)" fillcolor=lightgray];

    users   -> client [label="Business Queries"];
    client  -> server [label="HTTP/gRPC/WebSocket"];
    server  -> llm    [label="LLM API Calls"];
    llm     -> outputs [label="LLM Responses"];
    outputs -> users   [label="Delivered Insights"];
}
