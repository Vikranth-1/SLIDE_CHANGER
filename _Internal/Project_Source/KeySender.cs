using System;
using System.Windows.Forms;
using System.Threading;

namespace KeySender
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            // Keep the process alive and listening for input
            string line;
            while ((line = Console.ReadLine()) != null)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(line))
                    {
                        // Send the key press immediately
                        SendKeys.SendWait(line);
                    }
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine("Error sending key: " + ex.Message);
                }
            }
        }
    }
}
