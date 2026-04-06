import sys
import json
import asyncio
from main import mcp

async def run_tool(tool_name, *args):
    """Executes a tool from the MCP server by name."""
    try:
        # Check if tool exists
        tool = next((t for t in mcp._tools if t.name == tool_name), None)
        if not tool:
            print(f"Error: Tool '{tool_name}' not found.")
            return

        # Parse arguments (simple positional mapping for now)
        # In a real CLI, we'd use argparse or click for better parsing
        # This is a situational runner for the commander.
        
        # Calling the function directly (since FastMCP wraps it)
        # We need to map keys if possible, but for now let's try direct call
        # with unpacked args if it's a simple function
        
        # FastMCP tools are async wrappers or direct functions depending on definition
        # Let's try calling the underlying function if accessible, 
        # or use FastMCP's internal mechanism if exposed.
        # For simplicity in this 'Emergency' script, we'll try to match the function in globals() 
        # IF IT WAS EXPORTED, but main.py uses decorators.
        
        # BETTER APPROACH: Use the tool.fn (the underlying function)
        if asyncio.iscoroutinefunction(tool.fn):
             result = await tool.fn(*args)
        else:
             result = tool.fn(*args)
             
        print(f"\n✅ {tool_name.upper()} OUTPUT:\n" + "="*40 + "\n")
        print(result)
        print("\n" + "="*40)

    except Exception as e:
        print(f"❌ Execution Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: unicorn_cli.py <tool_name> [args...]")
        print("Available Tools:")
        for t in mcp._tools:
             print(f" - {t.name}: {t.description}")
        sys.exit(1)

    tool_name = sys.argv[1]
    tool_args = sys.argv[2:]
    
    asyncio.run(run_tool(tool_name, *tool_args))
