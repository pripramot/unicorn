"""Basic tests for the MCP agent server tools."""
import pytest


def test_server_import():
    """Verify main module can be imported."""
    from main import mcp
    assert mcp is not None
    assert mcp.name == "GTS Brain Connector 🧠"


def test_tools_registered():
    """Verify tools are registered on the MCP server."""
    from main import mcp
    tool_names = [t.name for t in mcp._tools]
    assert "google_search" in tool_names
    assert "web_analysis_check" in tool_names
    assert "cloudflare_shield_status" in tool_names
