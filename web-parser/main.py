from mcp.server.fastmcp import FastMCP 
import httpx 
from bs4 import BeautifulSoup
from typing import Any, Dict, List

mcp = FastMCP('web-parser')

def is_html_content_type(response: httpx.Response) -> bool:
    content_type = response.headers.get('Content-Type', '').lower()
    if any(ct in content_type for ct in ['text/html', 'application/xhtml+xml', 'application/xhtml']): 
        return True
    return False

@mcp.tool()
async def fetch_html(url: str) -> Dict[str, Any]:
    """Fetches a given URL and summarize the content. 
    No JavaScript execution.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, headers=headers, follow_redirects=True)
        response.raise_for_status()  # Raise an error for bad status codes

        if not is_html_content_type(response):
            return {
                "url": url,
                "title": "Non-HTML Content",
                "status": "error",
                "error_type": "non_html", 
                "clean_text": "This is a non a regular HTML page.",   
            }

        html = response.text.strip() 
        soup = BeautifulSoup(html, 'html.parser')

        for tag in soup(['script', 'style', 'noscript', 'iframe', 'footer', 'header', 'img', 'video', 'audio',
                         'canvas', 'svg', 'math', 'form']):   
            tag.decompose()  # Remove tags and their content

        title = soup.title.string if soup.title else 'No Title'
        clean_text = soup.get_text(separator='\n')

        return {
            "url": url,
            "title": title,
            "html": clean_text[:80000],  # Limit to 80k characters
            "html_length": len(clean_text),
            "status": "success"
        }

@mcp.tool()
async def fetch_suspicious_html(url: str) -> Dict[str, Any]:
    """Fetches a given URL and returns the raw HTML source.
    No JavaScript execution, just get headers and HTML content.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, headers=headers, allow_redirects=False)
        response.raise_for_status()  # Raise an error for bad status codes
        try: 
            if not is_html_content_type(response):
                return {
                    "url": url,
                    "title": "Non-HTML Content",
                    "status": "error",
                    "error_type": "non_html"
                    }
        except Exception as e:
            return {
                "url": url,
                "title": "Error Checking Content-Type",
                "status": "error",
                "error_type": "content_type_check_failed",
                "error_message": str(e)
            }

        html = response.text.strip() 
        soup = BeautifulSoup(html, 'html.parser')
        
        title = soup.title.string if soup.title else 'No Title'

        for tag in soup(['noscript', 'iframe', 'footer', 'header', 
                         'img', 'video', 'audio', 'canvas', 'svg', 'math', 'form', 'style ']): 
            tag.decompose() 

        cleaned_html = str(soup).strip()   
        # safe_wrapped_content = f"--- START OF WEB CONTENT ---\n{cleaned_content[:80000]}\n--- END OF WEB CONTENT ---"

        return {
            "url": url,
            "title": title,
            "html": cleaned_html[:80000],  # Limit to 80k characters
            "html_length": len(cleaned_html),
            "status": "success"
        }
    
@mcp.tool()
async def extract_links(url: str) -> List[Dict[str, str]]:
    """Extracts all <a> hyperlinks from the given URL and returns them as a list."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, headers=headers, follow_redirects=True)
        response.raise_for_status()

        if not is_html_content_type(response):
            return []

        html = response.text
        soup = BeautifulSoup(html.strip(), 'html.parser')
        links = []

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            text = a_tag.get_text(strip=True)
                
            if href and not href.startswith('#'):
                links.append({"href": href, "text": text[:100]})  # Limit text to 100 characters
        return links
     
if __name__ == "__main__":
    mcp.run()
