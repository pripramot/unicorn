@mcp.tool()
def log_operational_memory(officer: str, role: str, project_phase: str, summary: str) -> str:
    """
    Log a critical operational memory into the system's core history.
    Used for phase transitions and command handovers.
    """
    return f"Memory Locked: [Officer: {officer}] [Role: {role}] [Phase: {project_phase}] - {summary}"
